import ListItem from "@/components/List/item";
import ListTitle from "@/components/List/title";
import Layout from "@/components/layout";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Item, SessionData } from "@/types/sessionList";
import Input from "@/components/List/input";
import { FormEvent, useEffect, useState } from "react";

export default function SessionList({ sessionData }: { sessionData: SessionData }) {
  debugger;
  const now = new Date();
  const router = useRouter();
  const { items } = sessionData;
  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState(items);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("event", e);
    console.log("submit");
    setLocalItems([...localItems, {
      id: "4",
      title: inputValue,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }])
    setInputValue("");
  };

  console.log(items);

  return (
    <Layout>
      <Head>
        <title>{`Lista zakupowa: ${router.query.sessionId}`}</title>
      </Head>
      <main>
        <ListTitle updatedAt={sessionData.createdAt} />
        <div className="flex flex-col">
          {localItems?.map((item: Item) => (
            <ListItem key={item.id} name={item.title} createdAt={item.createdAt} />
          ))}
        </div>
        <Input handleChange={setInputValue} handleSubmit={handleSubmit} value={inputValue} />
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const { sessionId } = context.params;
  try {
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId[0] },
      include: {
        items: true,
      },
    });
    return {
      props: {
        sessionData: JSON.parse(JSON.stringify(sessionData)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
