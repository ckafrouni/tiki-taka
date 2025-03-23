"use client";

import { cognitiveDiversity } from "~/config/persona.json";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-900 text-white">
      <div className="container mx-auto flex flex-col gap-8 justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-center text-blue-200">
          Tiki-Taka
        </h1>

        <div className="flex flex-col gap-16">
          <div className="flex flex-row gap-8">
            <p className="flex-1 text-justify">
              {
                "We don't believe the popular notion idea-generation is a magical human capability and our collective MOAT over AI."
              }
              <br />
              {
                "When you hear the word efficient brainstorming, you think about about unique insights coming from unique perspectives. This is the benefit of cognitive diversity - different thinking patterns, different focus points - the same comes for political or philosophical debates in the form of views."
              }
              <br />
              {
                "A single AI will never create deeply contrarian and unique takes - its 'diffused' personality will only generate shallow ideas that are hard to disprove to avoid opposing itself but are also hardly valuable."
              }
              <br />
              {
                "That is why such discussions are better with a cluster of AIs. They challenge takes, build upon existing ones, and ask you the right questions - instead of parroting the most obvious ideas, it makes a deep exploration into the idea maze."
              }
              <br />
              {
                "AIs don't have the many biases we have and their lack of egos makes sure progress is done, no matter how many swear words are thrown around."
              }
              <br />
            </p>

            <p className="flex-1 text-justify">
              {
                "There are many applications which all require unique combination of thinking patterns. By capturing the views of the human, we can position the AIs perfectly asymmetrical to them."
              }
              <br />
              {
                "Conversations should be lively - dynamic turn-taking and interruption mechanisms are the future. Not just from the performance standpoint - this is the first time we can make 'discussion games'. Imagine trying to win an argument against Nietzsche and Aristotle about what the coolest Pokemon is."
              }
              <br />
              {
                "Currently we employ a flexible approach, where the user can decide whether and how he participates in the conversation. More specific flows like forcing him to answer specific questions or have him simply observe the automatic loops are interesting things to explore."
              }
              <br />
              {
                "Interestingly, arguments and ideas naturally let a tree structure emerge - graphs views would be cool."
              }
              <br />
            </p>
          </div>

          <div className="flex flex-row gap-6 justify-center">
            {Object.keys(cognitiveDiversity).map((taskName) => (
              <Link
                key={taskName}
                href={`/beta/${taskName}`}
                className="flex items-center justify-center text-neutral-900 bg-blue-200 hover:bg-blue-300 w-full p-4 text-center text-2xl font-semibold capitalize rounded-xl transition-colors"
              >
                {taskName.replace(/([A-Z])/g, " $1").trim()}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-center text-neutral-400">
            This was build during the EBL hackathon in Munich {"<3"}
          </p>
          <p className="text-center text-neutral-400">
            <Link
              href="https://github.com/ckafrouni"
              className="text-blue-200 hover:text-blue-300"
            >
              Chris
            </Link>
            <br />
            <Link
              href="https://github.com/codeScourge"
              className="text-blue-200 hover:text-blue-300"
            >
              Ivan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
