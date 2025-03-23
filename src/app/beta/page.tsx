"use client";

import { cognitiveDiversity } from "~/config/persona.json";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Choose your task</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(cognitiveDiversity).map((taskName) => (
            <Link key={taskName} href={`/beta/${taskName}`} className="block">
              <button className="w-full p-4 text-left bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                {/* replace camelcase with readable shit */}
                <h2 className="text-lg font-semibold capitalize">
                  {taskName.replace(/([A-Z])/g, " $1").trim()}
                </h2>
              </button>
            </Link>
          ))}
        </div>

        <p>
 I don't believe the popular notion idea-generation is a magical human capability and our collective MOAT over AI. I personally benefit from 

When you hear the word efficient brainstorming, you think about about unique insights coming from unique perspectives. This is the benefit of cognitive diversity - different thinking patterns, different focus points - the same comes for political or philosophical debates in the form of views.

A single AI will never create deeply contrarian and unique takes - its "diffused" personality will only generate shallow ideas that are hard to disprove to avoid opposing itself but are also hardly valuable.

That is why such discussion are better with a cluster of AIs. They challenge takes, build upon existing ones, and ask you the right questions - instead of parroting the most obvious ideas, it makes a deep exploration into the idea maze.

AIs don't have the many biases we have and their lack of egos makes sure progress is done, no matter how many swear words are thrown around.

--- 

There are many application which all require unique combination of thinking patterns. By capturing the views of the human, we can position the AIs perfectly assymetrical to them.

Conversations should be lively - dynamic turn-taking and interruption mechanisms are the future...

Currently we employ a flexible approach, where the user can decide whether and how he participates in the conversation. More specific flows like forcing him to answer specific questions or have him simply observe the automatic loops are interesting things to explore.

Interestingly, arguments and ideas naturally let a tree structure emerge - graphs views would be cool.
        </p>
      </main>
    </div>
  );
}
