import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UniversalPlacement } from '../src/components/UniversalPlacement';

const heading = 'heading';
const description = 'description';
const src = 'example.jpg';
const alt = 'alt';
const image = { src, alt };
const primaryOnClickMock = jest.fn();
const primary = {
  label: 'primary',
  onClick: () =>
    new Promise<void>((resolve) => {
      primaryOnClickMock();
      resolve(undefined);
    }),
};
const secondaryOnClickMock = jest.fn();
const secondary = {
  label: 'secondary',
  onClick: () =>
    new Promise<void>((resolve) => {
      secondaryOnClickMock();
      resolve(undefined);
    }),
};

const basic = { heading, description, image };

describe('<UniversalPlacement />', () => {
  it('should mount', () => {
    const { getByTestId } = render(<UniversalPlacement {...basic} />);
    const comp = getByTestId('universal-placement');
    expect(comp).toBeInTheDocument();
  });
  describe('props', () => {
    it('has the heading', () => {
      const { getByTestId } = render(<UniversalPlacement {...basic} />);
      const text = getByTestId('universal-placement-heading');
      expect(text).toHaveTextContent(heading);
    });
    it('has the description', () => {
      const { getByTestId } = render(<UniversalPlacement {...basic} />);
      const text = getByTestId('universal-placement-description');
      expect(text).toHaveTextContent(description);
    });
    it('has the image', () => {
      const { getByTestId } = render(<UniversalPlacement {...basic} />);
      const imageComp = getByTestId('universal-placement-img');
      expect(imageComp).toBeInTheDocument();
      expect(imageComp).toHaveAttribute('src', src);
      expect(imageComp).toHaveAttribute('alt', alt);
    });
    describe('primary', () => {
      it('does not have the primary cta', () => {
        const { queryByTestId } = render(<UniversalPlacement {...basic} />);
        const primaryComp = queryByTestId('universal-placement-primary');
        expect(primaryComp).not.toBeInTheDocument();
      });
      it('has the primary cta', () => {
        const { getByTestId } = render(
          <UniversalPlacement
            {...basic}
            primary={primary}
          />,
        );
        const primaryComp = getByTestId('universal-placement-primary');
        expect(primaryComp).toBeInTheDocument();
      });
      it('fires the primary cta click method when click', async () => {
        const { getByTestId } = render(
          <UniversalPlacement
            {...basic}
            primary={primary}
          />,
        );
        const primaryComp = getByTestId('universal-placement-primary');
        await userEvent.click(primaryComp);
        expect(primaryOnClickMock).toHaveBeenCalled();
      });
    });
    describe('secondary', () => {
      it('does not have the secondary cta when to provided', () => {
        const { queryByTestId } = render(<UniversalPlacement {...basic} />);
        const secondaryComp = queryByTestId('universal-placement-secondary');
        expect(secondaryComp).not.toBeInTheDocument();
      });
      it('does not have the secondary cta when the primary cta is not provided', () => {
        const { queryByTestId } = render(
          <UniversalPlacement
            {...basic}
            secondary={secondary}
          />,
        );
        const secondaryComp = queryByTestId('universal-placement-secondary');
        expect(secondaryComp).not.toBeInTheDocument();
      });
      it('has the secondary cta', () => {
        const { getByTestId } = render(
          <UniversalPlacement
            {...basic}
            primary={primary}
            secondary={secondary}
          />,
        );
        const secondaryComp = getByTestId('universal-placement-secondary');
        expect(secondaryComp).toBeInTheDocument();
      });
      it('fires the secondary cta click method when clicked', async () => {
        const { getByTestId } = render(
          <UniversalPlacement
            {...basic}
            primary={primary}
            secondary={secondary}
          />,
        );
        const secondaryComp = getByTestId('universal-placement-secondary');
        await userEvent.click(secondaryComp);
        expect(secondaryOnClickMock).toHaveBeenCalled();
      });
    });
    it('has the provided data-testid', () => {
      const { getByTestId } = render(
        <UniversalPlacement
          {...basic}
          data-testid="my-custom-testid"
        />,
      );
      const comp = getByTestId('my-custom-testid');
      expect(comp).toBeInTheDocument();
    });
  });
});
