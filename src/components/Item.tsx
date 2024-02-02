import { motion } from "framer-motion";

interface ItemProps {
  id: string;
  text: string;
  url: string;
  deleteItem: (id: string) => void;
}

const Item = ({ id, text, url, deleteItem }: ItemProps) => {
  return (
    <motion.div layout onClick={() => deleteItem(id)} className="item">
      item - {id}
      <div>{text}</div>
      <img src={url} style={{ objectFit: "contain", width: "100%" }} />
    </motion.div>
  );
};

export default Item;
