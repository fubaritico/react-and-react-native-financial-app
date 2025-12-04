import { create } from 'twrnc';

const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#6200EE',
        secondary: '#03DAC6',
      },
    },
  },
});

export default tw;
