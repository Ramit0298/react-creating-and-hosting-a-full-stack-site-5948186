import axios from "axios";

export default async function loader({ params }) {
  const response = await axios.get(`/api/articles/${params.name}`);
  const { upvotes, comments } = response.data;
  return { upvotes, comments };
}
