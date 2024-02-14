import { useEffect, useState } from "react";
import "./App.css";
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";
import Masonry from "@jassisingh/react-masonry";

const createRandomData = () => ({
  id: faker.string.uuid(),
  text: faker.lorem.paragraphs({ min: 1, max: 3 }),
  url: faker.image.url({
    height: faker.number.int({ min: 100, max: 1000 }),
  }),
});

const data = faker.helpers.multiple(createRandomData, { count: 20 });

function App() {
  const [items, setItems] = useState(data);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((e) => e.id != id));
  };

  return (
    <div style={{ padding: 16 }}>
      <Masonry
        padding={16}
        columnBreakPoints={{
          450: 2,
          750: 3,
          1050: 4,
        }}
      >
        {items.map((item) => (
          <div key={item.id}>
            <Item deleteItem={handleDelete} {...item} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default App;

interface ItemProps {
  id: string;
  text: string;
  url: string;
  deleteItem: (id: string) => void;
}

const Item = ({ id, text, url, deleteItem }: ItemProps) => {
  const [data, setData] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setData(text);
    }, 5000);
  }, []);
  return (
    <motion.div layout onClick={() => deleteItem(id)} className="item">
      item - {id}
      <div>{data}</div>
      <img src={url} style={{ objectFit: "contain", width: "100%" }} />
    </motion.div>
  );
};
