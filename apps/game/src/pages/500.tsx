import { useRouter } from 'next/router';
import { Error } from '@movie/ui';
import { Page } from '~/components/Page';

const Custom500 = () => {
  const router = useRouter();
  const images = [
    'http://localhost:3000/error-1.jpeg',
    'http://localhost:3000/error-2.jpeg',
    'http://localhost:3000/error-3.jpeg',
  ];

  const handleBackToHome = () => {
    void router.push('/');
  };

  return (
    <Page title="Movie Night">
      <Error
        images={images}
        text="uh oh! our projector broke. try again later..."
        cta={{ label: 'back to home', onClick: handleBackToHome }}
      />
    </Page>
  );
};

export default Custom500;
