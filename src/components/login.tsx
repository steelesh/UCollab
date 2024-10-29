export default function Login() {
  return (
    <div className="flex w-full justify-center overflow-hidden rounded-lg">
      <div className="my-16 flex justify-center">
        <div className="card w-full max-w-sm bg-base-300 shadow-2xl">
          <form className="card-body">
            <div className="form-control">
              <label htmlFor="email" className="label label-text">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder=""
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label label-text">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder=""
                className="input input-bordered"
                required
              />
              <label className="label">
                <a href="#" className="link-hover link label-text-alt">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
