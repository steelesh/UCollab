import Head from 'next/head';
import { motion } from 'framer-motion';
import SignInButton from '~/components/signin-button';

export default function Home() {
  return (
    <>
      <Head>
        <title>UCollab — Home</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <section className="flex w-full flex-col items-center justify-center px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true }}
            className="max-w-3xl text-center">
            <h1 className="mb-6 text-6xl font-extrabold select-none">
              Collaborate. Innovate. Succeed.
            </h1>
            <p className="mb-12 text-2xl select-none">
              UCollab connects students to work together on exciting projects.
            </p>
            <SignInButton />
          </motion.div>
        </section>

        <section className="w-full px-4 py-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true }}
              className="order-2 mt-8 md:order-1 md:mt-0 md:w-1/2">
              <h2 className="mb-4 text-4xl font-bold">Connect with Peers</h2>
              <p className="mb-4 text-lg">
                Build your network by connecting with students who share your
                interests and goals.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 md:w-1/2">
              <img
                src="/collab.svg"
                alt="Connect with Peers"
                className="w-full"
              />
            </motion.div>
          </div>
        </section>

        <section className="w-full px-4 py-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true }}
              className="md:w-1/2">
              <img
                src="/ideas.svg"
                alt="Discover Projects"
                className="w-full px-12"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true }}
              className="mt-8 md:mt-0 md:w-1/2">
              <h2 className="mb-4 text-4xl font-bold">Discover new Projects</h2>
              <p className="mb-4 text-lg">
                Explore a wide range of student-led projects and find the ones
                that ignite your passion.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
