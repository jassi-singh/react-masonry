interface ItemProps {
  id: string;
  text: string;
  url: string;
  deleteItem: (id: string) => void;
}

const Item = ({ id, text, url, deleteItem }: ItemProps) => {
  return (
    <div onClick={() => deleteItem(id)} className="item">
      item - {id}
      <div>{text}</div>
      <img src={url} style={{ objectFit: "contain", width: "100%" }} />
    </div>
  );
};

export default Item;
