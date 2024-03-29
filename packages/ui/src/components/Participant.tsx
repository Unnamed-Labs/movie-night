import { ProfileIcon } from './ProfileIcon';

export type ParticipantProps = {
  name: string;
  image?: {
    src: string;
    alt: string;
  };
  'data-testid'?: string;
};

export const Participant = ({
  name,
  image,
  'data-testid': dataTestId = 'participant',
}: ParticipantProps) => (
  <div
    className="ui-flex ui-w-full ui-min-h-[80px] ui-min-w-[304px] ui-flex-row ui-items-center ui-gap-4 ui-rounded-lg ui-bg-slate-700 ui-p-4 ui-shadow-md ui-shadow-black "
    title={name}
    data-testid={dataTestId}
  >
    {image && (
      <ProfileIcon
        src={image.src}
        alt={image.alt}
        data-testid={`${dataTestId}-profile-icon`}
      />
    )}
    <span
      className="ui-text-base ui-text-slate-50 ui-font-raleway"
      data-testid={`${dataTestId}-name`}
    >
      {name}
    </span>
  </div>
);
