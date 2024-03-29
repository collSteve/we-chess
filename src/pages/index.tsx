import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import PlayChess from "./play-chess";

import {io} from 'socket.io-client'
import { useEffect } from "react";
import CreateJoinGamePage from "./create-join-game";

// import { getSocket } from "~/services/websocket";

// const socket = getSocket();


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const socketi = api.socket.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      {/* <PlayChess></PlayChess> */}
      <CreateJoinGamePage></CreateJoinGamePage>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
