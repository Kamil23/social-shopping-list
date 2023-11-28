import Image from "next/image";

const AddButton = ({ handler }) => {
  return (
    <div
      onClick={handler}
      className="fixed bottom-40 right-9 w-16 h-16 rounded-full bg-primary-blue flex justify-center items-center"
    >
      <Image
        src="/icons/plus-add-element.svg"
        alt="ikona plus"
        width={16}
        height={16}
      />
    </div>
  );
};

export default AddButton;
