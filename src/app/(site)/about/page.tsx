/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto p-5 mt-0 md:mt-16">
      <header className="flex justify-between items-center max-w-xl mx-auto">
        <Image src="/logo.svg" alt="Ouranos logo" width={120} height={35} />
        <Link
          href="/"
          className="font-medium text-neutral-500 hover:text-neutral-600"
        >
          Home
        </Link>
      </header>
      <section className="mt-16 max-w-xl mx-auto animate-fade">
        <h1 className="mb-6 text-4xl font-medium text-neutral-600 max-w-lg">
          About
        </h1>
        <p>
          Ouranos is an open-source{" "}
          <Link href="https://blueskyweb.xyz/" className="underline">
            Bluesky
          </Link>{" "}
          client for the web, built using{" "}
          <Link href="https://nextjs.org/" className="underline">
            Next.js
          </Link>
          . Similar to the official Bluesky app, it uses the{" "}
          <Link href="https://blueskyweb.xyz/" className="underline">
            AT Protocol
          </Link>
          , a decentralized networking technology for social media. This is
          similar to Twitter apps such as Twitterrific or Tweetbot that used
          Twitter's API in the past.
        </p>

        <p className="mt-3">
          The app is being developed and designed by me,{" "}
          <Link
            href="https://bsky.app/profile/contrapunctus.bsky.social"
            className="underline"
          >
            Pouria
          </Link>
          . I started the project to learn more about the AT Protocol and as fun
          way to practice my skills while I look for a full-time role after
          graduation.
        </p>

        <h2 className="mt-12 mb-6 text-2xl font-medium text-neutral-600">
          Frequently Asked Questions
        </h2>

        <h3 className="mb-1 text-lg font-semibold text-neutral-600">
          Is anything stored on your servers?
        </h3>
        <p>
          Nothing is stored, every request goes to the official Bluesky servers.
          When you log in, your session is stored using cookies on your web
          browser.
        </p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          Why do you recommend using an app password?
        </h3>
        <p>
          App passwords allow you to log in and use the app, but restrict
          third-party clients (ex. Ouranos) from certain functionalities such as
          account deletion or generating additional app passwords.
        </p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          Does Ouranos have extra features?
        </h3>
        <p>
          The current goal is to implement all the functionalities provided by
          the official app, and add more enhancements (some are currently
          implemented) without storing anything on our side.
        </p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          Will there be a mobile app?
        </h3>
        <p>
          Ouranos is designed to be responsive and works farily well on mobile.
          At the moment, there are no plans to develop a native mobile app.
          However, that may change after achieving the project's current goal
          (see previous answer).
        </p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          Is there a dark mode?
        </h3>
        <p>Not at the moment, but it will be added soon.</p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          How can I provide feedback?
        </h3>
        <p>
          If you have an account on GitHub, you can go to the project's{" "}
          <Link href="" className="underline">
            repository
          </Link>{" "}
          and create an issue. You can also mention me on Bluesky (my handle is{" "}
          @contrapunctus.bsky.social). If you enjoy using Ouranos, let me know!
          I'd love to hear from you.
        </p>

        <h3 className="mb-1 mt-6 text-lg font-semibold text-neutral-600">
          Can I support the project?
        </h3>
        <p className="mt-3">
          If you like to support the project and help keep the site up and
          running, stay tuned for more information!
        </p>
      </section>
      <footer className="mt-16 text-center text-sm font-mono text-neutral-500">
        OURANOS · EARLY ACCESS · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
