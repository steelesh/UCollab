import { Spinner } from '~/components/ui/spinner';

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center">
      <Spinner />
    </div>
  );
}

export default LoadingSpinner;
