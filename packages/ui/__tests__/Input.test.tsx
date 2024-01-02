import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/components/Input';

const label = 'Name';
let value = 'Aaron';
const handleOnChange = (val: string) => {
  value = val;
};
const helpText = 'My help text';
const error = 'My error';

describe('<Input />', () => {
  it('should mount', () => {
    const { getByLabelText } = render(
      <Input
        label={label}
        defaultValue={value}
        onChange={handleOnChange}
      />,
    );
    const elem = getByLabelText(label);
    expect(elem).toBeInTheDocument();
  });

  describe('label', () => {
    it('should show the label when present', () => {
      const { getByLabelText } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChange}
        />,
      );
      const elem = getByLabelText(label);
      expect(elem).toBeInTheDocument();
    });
    it('should mark as required in the label', () => {
      const { getByLabelText } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChange}
          required
        />,
      );
      const elem = getByLabelText(`${label} *`);
      expect(elem).toBeInTheDocument();
    });
    it('should not show the label when not present', () => {
      const { getByTestId, queryByLabelText } = render(
        <Input
          defaultValue={value}
          onChange={handleOnChange}
          required
        />,
      );
      const notFound = queryByLabelText(label);
      const elem = getByTestId('input');
      expect(elem).toBeInTheDocument();
      expect(notFound).toBeFalsy();
    });
  });

  describe('state', () => {
    it('should show the help text when provided', () => {
      const { getByTestId } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChange}
          helpText={helpText}
        />,
      );
      const elem = getByTestId('input-help-text');
      expect(elem).toBeInTheDocument();
    });
    it('should show an error', () => {
      const { getByTestId } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChange}
          error={error}
        />,
      );
      const elem = getByTestId('input-error');
      expect(elem).toBeInTheDocument();
    });
    it('should show an error over a help text', () => {
      const { queryByTestId } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChange}
          error={error}
        />,
      );
      const errorElem = queryByTestId('input-error');
      const helpTextElem = queryByTestId('input-help-text');
      expect(errorElem).toBeInTheDocument();
      expect(helpTextElem).toBeFalsy();
    });
  });

  describe('events', () => {
    it('should call callback function upon user event', async () => {
      const handleOnChangeMock = jest.fn(handleOnChange);
      const user = userEvent.setup();
      const { getByLabelText } = render(
        <Input
          label={label}
          defaultValue={value}
          onChange={handleOnChangeMock}
        />,
      );
      const elem = getByLabelText(label);
      await user.click(elem);
      await user.type(elem, ' Mathews');
      await user.tab();
      expect(handleOnChangeMock).toHaveBeenCalled();
    });
  });
});
