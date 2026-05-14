import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'

/**
 * Type pour les erreurs de validation - clé = nom du champ, valeur = message d'erreur
 */
type ValidationErrors = Record<string, string>

/**
 * Hook personnalisé pour la validation de formulaires avec Zod
 * Fournit une validation progressive (champ par champ), une validation complète,
 * et la surveillance automatique des changements du formulaire
 *
 * @template T - Type des données du formulaire
 *
 * @param schema - Schéma Zod pour la validation
 * @param currentData - Données actuelles du formulaire
 *
 * @returns Objet contenant les fonctions et états de validation
 */
export const useFormValidation = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  currentData: T
) => {
  // Etat du formulaire
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [hasErrors, setHasErrors] = useState(false)

  /**
   * Copie figée des données initiales (première valeur de currentData, ne change jamais)
   */
  const initialFormData = useRef<T | null>(null)
  const hasValidatedOnMount = useRef(false)

  /**
   * Faire la copie seulement au premier rendu
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- JSON round-trip for deep clone
  initialFormData.current ??= JSON.parse(JSON.stringify(currentData))

  /**
   * Calcul automatique si le formulaire a changé
   */
  const hasFormChanged = useMemo(
    () =>
      JSON.stringify(currentData) !== JSON.stringify(initialFormData.current),
    [currentData]
  )

  /**
   * Validation silencieuse au montage pour set hasErrors seulement
   */
  useEffect(() => {
    if (!hasValidatedOnMount.current) {
      try {
        schema.parse(currentData)
        setHasErrors(false)
      } catch {
        setHasErrors(true)
      }
      hasValidatedOnMount.current = true
    }
  }, [schema, currentData, setHasErrors])

  /**
   * Valide un champ spécifique du formulaire
   * N'affiche les erreurs que pour les champs déjà "touchés" par l'utilisateur
   *
   * @param fieldName - Nom du champ à valider
   * @param value - Nouvelle valeur du champ
   * @param formData - Données complètes du formulaire avec la nouvelle valeur
   *
   * @returns true si le champ est valide, false sinon
   */
  const validateField = useCallback(
    (fieldName: keyof T, value: unknown, formData: T) => {
      // Marquer le champ comme "touché"
      setTouchedFields((prev) => new Set(prev).add(fieldName as string))

      try {
        // Créer une copie des données avec la nouvelle valeur
        const updatedData = { ...formData, [fieldName]: value }

        // Valider tout le formulaire pour avoir le contexte complet
        schema.parse(updatedData)

        // Si valide, supprimer l'erreur pour ce champ
        setErrors((prev) => {
          const { [fieldName as string]: _, ...rest } = prev
          setHasErrors(Object.keys(rest).length > 0)
          return rest
        })

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Ne traiter que les erreurs des champs déjà touchés
          setErrors((prev) => {
            const { [fieldName as string]: _, ...newErrors } = prev

            // Ajouter les nouvelles erreurs seulement pour les champs touchés
            error.errors.forEach((err) => {
              const errorFieldName = err.path[0] as string

              if (
                touchedFields.has(errorFieldName) ||
                errorFieldName === fieldName
              ) {
                newErrors[errorFieldName] = err.message
              }
            })

            // Mettre à jour hasErrors après modification des erreurs
            setHasErrors(true)

            return newErrors
          })

          // Retourner true si ce champ spécifique n'a pas d'erreur
          const fieldError = error.errors.find(
            (err) => err.path[0] === fieldName
          )

          return !fieldError
        }
      }

      return false
    },
    [schema, touchedFields]
  )

  /**
   * Valide le formulaire de manière silencieuse (sans afficher les erreurs)
   * Utilisé pour vérifier la validité sans impacter l'interface utilisateur
   *
   * @param formData - Données complètes du formulaire à valider
   *
   * @returns true si le formulaire est valide, false sinon
   */
  const validateFormSilently = useCallback(
    (formData: T) => {
      try {
        schema.parse(formData)

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          return false
        }
      }

      return false
    },
    [schema]
  )

  /**
   * Valide tout le formulaire et affiche toutes les erreurs
   * Utilisé lors de la soumission ou validation complète
   *
   * @param formData - Données complètes du formulaire à valider
   *
   * @returns true si le formulaire est valide, false sinon
   */
  const validateForm = useCallback(
    (formData: T) => {
      try {
        schema.parse(formData)
        setErrors({})
        setHasErrors(false)

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: ValidationErrors = {}

          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message
            }
          })
          setErrors(newErrors)
          setHasErrors(true)

          return false
        }
      }

      return false
    },
    [schema]
  )

  /**
   * Efface toutes les erreurs de validation
   */
  const clearErrors = useCallback(() => {
    setErrors({})
    setHasErrors(false)
  }, [])

  /**
   * Remet à zéro la liste des champs touchés
   * Utile lors de la réinitialisation du formulaire
   */
  const resetTouchedFields = useCallback(() => {
    setTouchedFields(new Set())
  }, [])

  return {
    /** Objet contenant les erreurs actuelles (clé = nom du champ, valeur = message) */
    errors,

    /** Fonction pour valider un champ spécifique (validation progressive) */
    validateField,

    /** Fonction pour valider tout le formulaire avec affichage des erreurs */
    validateForm,

    /** Fonction pour valider tout le formulaire sans afficher les erreurs */
    validateFormSilently,

    /** Fonction pour effacer toutes les erreurs */
    clearErrors,

    /** Fonction pour remettre à zéro les champs touchés */
    resetTouchedFields,

    /** Booléen indiquant s'il y a des erreurs actuellement */
    hasErrors,

    /** Booléen indiquant si le formulaire a changé par rapport aux données initiales */
    hasFormChanged,
  }
}
