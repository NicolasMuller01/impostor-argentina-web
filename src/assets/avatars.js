const avatarModules = import.meta.glob('./animals/*.png', {
  eager: true,
  import: 'default',
});

export const AVATARS = Object.entries(avatarModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, imagePath]) => imagePath);

