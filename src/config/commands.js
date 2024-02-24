export const defaultDefault = {
  scope: {
    type: 'default',
  },
  commands: [
    {
      command: 'packs',
      description: 'List your packs',
    },
    {
      command: 'new',
      description: 'Create a new pack',
    },
    {
      command: 'copy',
      description: 'Copy existing pack',
    },
    {
      command: 'original',
      description: 'Find original sticker',
    },
    {
      command: 'settings',
      description: 'Open bot settings',
    },
    {
      command: 'cancel',
      description: 'Cancel current operation',
    },
    {
      command: 'help',
      description: 'Get help',
    },
  ],
};

export const defaultEn = {
  ...defaultDefault,
  language: 'en',
};

export const defaultRu = {
  scope: {
    type: 'default',
  },
  language: 'ru',
  commands: [
    {
      command: 'packs',
      description: 'Список стикерпаков',
    },
    {
      command: 'new',
      description: 'Создать новый стикерпак',
    },
    {
      command: 'copy',
      description: 'Скопировать стикерпак',
    },
    {
      command: 'original',
      description: 'Найти оригинал стикера',
    },
    {
      command: 'settings',
      description: 'Настройки',
    },
    {
      command: 'cancel',
      description: 'Отмена текущего действия',
    },
    {
      command: 'help',
      description: 'Помощь',
    },
  ],
};
