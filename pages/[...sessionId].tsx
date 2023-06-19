import ListItem from "@/components/List/item";
import Layout from "@/components/layout";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Item, SessionData } from "@/types/sessionList";
import Input from "@/components/List/input";
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from "react";
import Empty from "@/components/Empty";
import { APIUrl } from "@/enum";
import { sortByUpdatedAtAndIsDisabled } from "@/helpers";
import { deleteItem } from "@/requests";
import Line from "@/components/Line";
import useList from "@/hooks/useList";

export default function SessionList({
  sessionData,
}: {
  sessionData: SessionData;
}) {
  const { saveData } = useList();
  const now = new Date();
  const router = useRouter();
  const { items } = sessionData || {};

  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState(
    items?.sort(sortByUpdatedAtAndIsDisabled) || []
  );

  useEffect(() => {
    saveData(sessionData);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const itemsLength = localItems.length;
      const submittedData = {
        id: window.crypto.randomUUID(),
        title: inputValue,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        sessionId: sessionData.id,
        isDisabled: false,
        sortOrder: itemsLength + 1,
      };

      setLocalItems(
        [...localItems, submittedData].sort(sortByUpdatedAtAndIsDisabled)
      );
      setInputValue("");

      const JSONdata = JSON.stringify(submittedData);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.CreateItem, options);
    } catch (error) {
      console.error("Create item error: ", error);
    }
  };

  const toggleCheck = async (
    id: string,
    isChecked: boolean,
    setIsChecked: Dispatch<SetStateAction<boolean>>,
    setUpdateTime: Dispatch<SetStateAction<string>>
  ) => {
    try {
      const now = new Date().toISOString();
      const modifiedData = {
        id,
        updatedAt: now,
        isDisabled: !isChecked,
      };
      setIsChecked(!isChecked);
      setUpdateTime(now);

      const indexOfSelectedItem = localItems.findIndex(
        (item) => item.id === id
      );
      localItems[indexOfSelectedItem].updatedAt = now;
      localItems[indexOfSelectedItem].isDisabled = !isChecked;
      const sortedItems = localItems.sort(sortByUpdatedAtAndIsDisabled);
      setLocalItems([...sortedItems]);

      const JSONdata = JSON.stringify(modifiedData);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.UpdateItem, options);
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const list = JSON.parse(JSON.stringify(localItems));
    const updatedList = list.filter((item: Item) => item.id !== id);
    setLocalItems([...updatedList.sort(sortByUpdatedAtAndIsDisabled)]);
    await deleteItem(id);
  };

  const renderContent = () => {
    if (!sessionData?.id) {
      return (
        <div className="flex justify-center items-center h-full">
          <Empty />
        </div>
      );
    }
    return (
      <div className="pt-32 pb-20">
        <div className="flex flex-col">
          {localItems?.map((item: Item) => (
            <div key={item.id}>
              <Line />
              <ListItem
                key={item.id}
                data={item}
                toggleCheck={toggleCheck}
                handleDelete={handleDeleteItem}
              />
            </div>
          ))}
        </div>

        <Input
          handleChange={setInputValue}
          handleSubmit={handleSubmit}
          value={inputValue}
        />
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>{`Lista zakupowa: ${router.query.sessionId}`}</title>
      </Head>
      {renderContent()}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sessionId } = context.params || {};
  try {
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId?.[0] },
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
