# 1.0.0 (2026-04-21)


### Bug Fixes

* **mobile:** enable wireless iPhone deployment and fix sandbox violation ([824ba71](https://github.com/fubaritico/react-and-react-native-financial-app/commit/824ba7136ba466297da10c77ad9e1752f93d7026))
* **monorepo:** align React versions and fix cache issues ([d67c956](https://github.com/fubaritico/react-and-react-native-financial-app/commit/d67c956998a0ce4d5b368f3b814393e8d1c02b58))
* **tokens:** align alias names with Figma variable naming ([d9345ae](https://github.com/fubaritico/react-and-react-native-financial-app/commit/d9345aeb25a587df64a26a4a586352561e071668))
* **ui:** replace default Tailwind colors with token aliases ([5d3939b](https://github.com/fubaritico/react-and-react-native-financial-app/commit/5d3939b96aa04c2da8a9fcd7ea22d763b33dad02))


### Features

* added .nvmrc and .gitattributes files ([836d77d](https://github.com/fubaritico/react-and-react-native-financial-app/commit/836d77dd5681ea7ecd79ef0dd7bb74c7f5fabc7a))
* added env for BDD credentials ([c08b401](https://github.com/fubaritico/react-and-react-native-financial-app/commit/c08b4019e8528439de6b969fc9cec13b2595601a))
* added shared design system ([69b2530](https://github.com/fubaritico/react-and-react-native-financial-app/commit/69b25309bb897f486afe8585eb3c7d3776ad9b5a))
* alignement de mobile-expo-ejected aveclesmême dépendances ([c3df036](https://github.com/fubaritico/react-and-react-native-financial-app/commit/c3df03680c52be2e98b931e9860a5c1c0ddcc842))
* **apps:** wire auth clients, Google Sign-In, and env files (Phase 5.8) ([0e2bcbf](https://github.com/fubaritico/react-and-react-native-financial-app/commit/0e2bcbf908951f2d108dc179e814415f0fdce6a5))
* **config:** add agent skills — migrate commands + vendor Expo/Callstack skills ([3847dc7](https://github.com/fubaritico/react-and-react-native-financial-app/commit/3847dc73a293dab050ad88f3f8ae7e712f867feb))
* **config:** add multi-agent review skill with 5 domain experts ([bda46f8](https://github.com/fubaritico/react-and-react-native-financial-app/commit/bda46f858062652f7617d8143337565926ff156b))
* **config:** add restart-session skill for end → clear → start flow ([4f2f6b6](https://github.com/fubaritico/react-and-react-native-financial-app/commit/4f2f6b6a669273d5abc45fea1109a63c7cea70ed))
* **config:** add setup-tokens-package and migrate-to-nativewind-v5 skills ([1d9caa6](https://github.com/fubaritico/react-and-react-native-financial-app/commit/1d9caa60ec308b74bed7ee14282645261bffa92a))
* **config:** add setup-ui-package skill with architecture reference ([44982df](https://github.com/fubaritico/react-and-react-native-financial-app/commit/44982df4e2fb4aa4d4a03ba965b4cfac2cf0d72a))
* **expo:** add expo-dev-client and native build scripts ([1b26c7f](https://github.com/fubaritico/react-and-react-native-financial-app/commit/1b26c7f61490496cf77043e28ff08033829bc8e9))
* **icons:** add Fb app icon to all mobile apps ([e18ea02](https://github.com/fubaritico/react-and-react-native-financial-app/commit/e18ea02267c836173524182be2629b4d8cd3142b))
* **mobile:** add React Navigation with 5 tabs + auth stack (on standby) ([3434972](https://github.com/fubaritico/react-and-react-native-financial-app/commit/343497262a35c75e6ef481c54f4ab4075df8479f))
* **mobile:** react native package basic setup ([ab09677](https://github.com/fubaritico/react-and-react-native-financial-app/commit/ab09677a32fae9ba09ffdfa89bdcf3a46a13186f))
* **mobile:** reinstall deps with pnpm ([0edc846](https://github.com/fubaritico/react-and-react-native-financial-app/commit/0edc8468983485f24b175ccd43f1cc33a1f575dc))
* **mobile:** set android for app preview ([4ac7220](https://github.com/fubaritico/react-and-react-native-financial-app/commit/4ac722067d12b31dc8f1ffa18b7dc07141e3e2d6))
* **mobile:** set bundler for monorepo and app first launch ([ef90526](https://github.com/fubaritico/react-and-react-native-financial-app/commit/ef905268a13f1178a356f502758e134105189563))
* **mobile:** set ejected expo project ([aa156fc](https://github.com/fubaritico/react-and-react-native-financial-app/commit/aa156fc87b8658222436e709bb2b18fb6b6a107e))
* **mobile:** set project with expo ([dae87e9](https://github.com/fubaritico/react-and-react-native-financial-app/commit/dae87e9708fe26bfac0f9fc223c00951bbd6088e))
* **monorepo:** add changelog generation and type-check scripts ([0d4e8e4](https://github.com/fubaritico/react-and-react-native-financial-app/commit/0d4e8e4152898ac353d95b283d2390d1f9b84f18))
* **shared:** create @financial-app/shared package (Phase 5.1 + 5.7) ([6cb1d2c](https://github.com/fubaritico/react-and-react-native-financial-app/commit/6cb1d2c95e6e5c120727fc33d7dd8f061d006ff2))
* styles based on nativewind and used by apps and ds ([d95e9f2](https://github.com/fubaritico/react-and-react-native-financial-app/commit/d95e9f2966e13816f1cb7ef78b9fc786e1c4ec47))
* **tailwind-config:** create @financial-app/tailwind-config (Phase 2) ([257f51d](https://github.com/fubaritico/react-and-react-native-financial-app/commit/257f51de7d099f73d2c9754855d1b797c04a2f21))
* **tokens:** create @financial-app/tokens package (Phase 0) ([76b2857](https://github.com/fubaritico/react-and-react-native-financial-app/commit/76b2857cda2768fa3ac35888dd90244aff5736f0))
* **ui:** add Wave 1 auth components (TextInput, PasswordInput, LinkText, AuthCard, AuthLayout) ([93d6ee2](https://github.com/fubaritico/react-and-react-native-financial-app/commit/93d6ee268fc52406f412041b13976a24c83ed04d))
* **ui:** add Wave 2 + Wave 3 overview components with accessibility fixes ([4e32a4d](https://github.com/fubaritico/react-and-react-native-financial-app/commit/4e32a4da7086b3d92976370303a0200382402f4c))
* **ui:** cross-platform refactor with file extension split (Phase 3) ([75e52eb](https://github.com/fubaritico/react-and-react-native-financial-app/commit/75e52eb986da00dfa20fb92f397f3e93d19026b2))
* **ui:** refactor Button to 4 Figma variants (primary/secondary/tertiary/destroy) ([ac55aa6](https://github.com/fubaritico/react-and-react-native-financial-app/commit/ac55aa642ce2dad6d46bfef5ebfd18aee79f912c))
* **web:** create apps/web with React Router v7 SSR (Phase 4) ([4ffb08a](https://github.com/fubaritico/react-and-react-native-financial-app/commit/4ffb08a4a90266ab12a58dca219742713c843511))
