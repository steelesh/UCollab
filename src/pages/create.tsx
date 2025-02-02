import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';

const CreateProjectPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');
  const [postType, setPostType] = useState<string>('');
  const router = useRouter();

  const handleTechnologyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && e.currentTarget.value.trim() !== '') {
      const newTech = e.currentTarget.value.trim().toLowerCase();
      if (!technologies.includes(newTech)) {
        setTechnologies([...technologies, newTech]);
      }
      e.currentTarget.value = '';
      e.preventDefault();
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setTechnologies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPost = {
      title,
      description,
      postType: postType.toUpperCase().replace(' ', '_'),
      status: 'OPEN',
      technologies,
      githubRepo,
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      if (response.ok) {
        void router.push('/explore');
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handlePostTypeToggle = (type: string) => {
    setPostType((prev) => (prev === type ? '' : type));
  };

  return (
    <>
      <Head>
        <title>UCollab — Create</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto pt-8">
        <div className="bg-base-300 mx-auto w-full max-w-5xl rounded-lg p-4 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Create Your Project
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Project Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter the project title"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Describe your project"
                required></textarea>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Technologies</span>
              </label>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="btn btn-outline btn-neutral btn-xs cursor-pointer font-normal tracking-wider"
                    onClick={() => handleRemoveTechnology(index)}
                    initial={{ opacity: 0.0, scale: 0.8 }}
                    animate={{ opacity: 1.0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.2 }}>
                    {tech} ✕
                  </motion.div>
                ))}
              </div>
              <input
                type="text"
                onKeyDown={handleTechnologyInput}
                className="input input-bordered w-full"
                placeholder="Add some technologies"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">GitHub Repository</span>
              </label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Link to the GitHub repo"
              />
            </div>
            <div className="flex gap-4">
              {['Contribution', 'Feedback', 'Discussion'].map((type) => (
                <motion.button
                  key={type}
                  className={`btn btn-outline btn-xs ${postType === type ? 'btn-success' : 'btn-accent'} rounded-lg`}
                  onClick={() => handlePostTypeToggle(type)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.0 }}
                  type="button">
                  {type.replace('_', ' ')}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1.0 }}
              type="submit"
              className="btn btn-primary mx-auto mt-6 block w-auto px-8">
              Create Project
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProjectPage;
