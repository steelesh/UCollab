'use client';

import Form from 'next/form';
import { updateOnboarding } from '~/features/users/user.actions';

export default function OnboardingModal() {
  return (
    <>
      <button className="btn" onClick={() => document.getElementById('onboard_modal').showModal()}>
        open modal
      </button>
      <dialog id="onboard_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
          </form>
          <h3 className="text-lg font-bold">Onboarding</h3>
          <Form action={updateOnboarding} className="p-4">
            <div className="form-control mb-4">
              <label className="label" htmlFor="gradYear">
                <span className="label-text">Graduation Year</span>
              </label>
              <input
                type="text"
                name="gradYear"
                id="gradYear"
                className="input input-bordered w-full"
                placeholder="2025"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label" htmlFor="skills">
                <span className="label-text">Skills (comma-separated)</span>
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="input input-bordered w-full"
                placeholder="e.g., react, nextjs, tailwind"
              />
            </div>
            <div className="form-control mb-6">
              <label className="label" htmlFor="githubProfile">
                <span className="label-text">GitHub Profile</span>
              </label>
              <input
                type="text"
                id="githubProfile"
                name="githubProfile"
                className="input input-bordered w-full"
                placeholder="Link to the GitHub profile"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <div className="flex flex-col items-center">
                <input type="radio" name="postType" id="mentor" value="Mentor" className="peer hidden" />
                <label
                  htmlFor="mentor"
                  className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                  Mentor
                </label>
              </div>
              <div className="flex flex-col items-center">
                <input type="radio" name="postType" id="mentee" value="Mentee" className="peer hidden" />
                <label
                  htmlFor="mentee"
                  className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                  Looking for Mentor
                </label>
              </div>
              <div className="flex flex-col items-center">
                <input type="radio" name="postType" id="none" value="None" className="peer hidden" defaultChecked />
                <label
                  htmlFor="none"
                  className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content mb-2 rounded-lg peer-checked:text-white">
                  None
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary-content mx-auto mt-6 block w-auto px-8">
              Submit
            </button>
          </Form>
        </div>
      </dialog>
    </>
  );
}
