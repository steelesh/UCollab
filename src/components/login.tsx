export default function Login() {
  return (
    <div className="hero min-h-screen">
      <div className="card w-full max-w-sm shrink-0 bg-base-200 shadow-2xl">
        <form className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder=""
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
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
  );
}
