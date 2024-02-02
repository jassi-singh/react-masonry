import { useState } from "react";
import "./App.css";
import Item from "./components/Item";
import Masonry from "./components/Masonry";
import { faker } from "@faker-js/faker";

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
