import { useRouter } from 'next/router';
import { UniversalPlacement } from '@movie/ui';
import { Page } from '~/components/Page';

const Custom404 = () => {
  const router = useRouter();
  const errorImageNumber = Math.floor(Math.random() * 3) + 1;
  const errorImage = {
    src: `http://localhost:3000/error-${errorImageNumber}.jpeg`,
    alt: '',
  };

  const handleBackToHome = () => {
    void router.push('/');
  };

  return (
    <Page title="Movie Night">
      <UniversalPlacement
        heading="uh oh!"
        description="the page you are looking for was renamed, moved, or did not exist..."
        image={errorImage}
        primary={{ label: 'back to home', onClick: handleBackToHome }}
      />
    </Page>
  );
};

export default Custom404;
