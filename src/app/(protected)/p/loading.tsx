import { Spinner } from '~/components/ui/spinner';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center py-72">
      <Spinner />
    </div>
  );
}

export default LoadingSpinner;
