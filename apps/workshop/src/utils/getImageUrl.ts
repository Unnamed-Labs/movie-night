export const getImageUrl = (src: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const workshopUrl = import.meta.env.STORYBOOK_URL;

  if (workshopUrl) {
    return `${workshopUrl}${src}`;
  }

  return src;
};
