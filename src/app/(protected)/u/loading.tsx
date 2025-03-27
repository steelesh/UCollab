import { Spinner } from "~/components/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <Spinner />
    </div>
  );
}

export default LoadingSpinner;
