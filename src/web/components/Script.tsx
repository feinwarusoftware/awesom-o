import Router from "next/router";

export default function Script({
  id,
  name,
  author,
  image,
  likes,
  servers,
  verifiedScript,
  verifiedAuthor
}) {
  return (
    <div className="script" style={{ backgroundImage: `url(${image})` }}>
      <div className="gradient" />
      <div className="fill" />
      <div className="content">
        <h4>{name}</h4>
        <h5>
          by {author}{" "}
          {verifiedAuthor && (
            <sup>
              <i className="fas fa-check-circle" />
            </sup>
          )}
        </h5>
        <div className="overflow-content">
          <div className="likes-servers">
            <p>
              <i className="fas fa-heart" /> {likes} likes
            </p>
            <p>
              <i className="fas fa-server" /> {servers} servers
            </p>
          </div>
          <button
            className="btn-outline red"
            onClick={() => console.log("lol")}
          >
            Like this script
          </button>
          <button className="btn-outline" onClick={() => Router.push("/dashboard/script/[id]", `/dashboard/script/${id}`).then(() => window.scrollTo(0, 0))}>View details</button>
        </div>
      </div>
    </div>
  );
}
