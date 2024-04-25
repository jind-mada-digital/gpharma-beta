import React, { useState } from "react"; 
import { useRecoilState } from "recoil";
import { listNotifs } from "../../atoms/notification";
import {
  deleteData,
  getIconNotif,
  updateNotif,
} from "../../utils/utils";

function GestionNotification({ socket }) {
  const [list, setList] = useRecoilState(listNotifs);
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredData = list.filter((item) => {
    const text = item.label + item.details + item.createdAt;
    return text.toLowerCase().includes(search.toLowerCase());
  });
 
  return (
    <>
      <div style={{ margin: "10px" }}>
        <div className="form-group">
          <label htmlFor="filter-gestion-notification" className="font-w600">
            Filtre
          </label>
          <input
            type="text"
            id="filter-gestion-notification"
            className="form-control"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table>
          <tbody>
            {filteredData.map((notif, index) => (
              <tr
                key={notif.id}
                className={notif.etat == "NOUVELLE" ? "bg-light mb-1" : "mb-1"}
                style={{
                  padding: "5px 0px 5px 0px",
                  margin: "0px 0px 10px 0px",
                  cursor: notif.etat == "NOUVELLE" ? "pointer" : "default",
                }}
              >
                <td style={{ padding: "0 0px" }}>
                  <div
                    className={"badge py-3 "}
                    onClick={() =>
                      updateNotif(notif ,socket)
                    }
                  >
                  <i
                    style={{ width: "2.8vw" }}
                    className={
                      notif.icon
                        ? "fa fa-2xl fa-" +
                          notif.icon +
                          " text-" +
                          notif.importance
                        : "fa fa-2xl fa-" +
                          getIconNotif(notif.importance) +
                          " text-" +
                          notif.importance
                    }
                  />
                  </div>
                </td>
                <td
                  style={{ padding: "10px 10px 10px 10px" }}
                  onClick={() =>
                    updateNotif(notif ,socket)
                  }
                >
                  <h6 className="mb-1">{notif.label}</h6>
                  <small className="d-block">{notif.details}</small>
                  <small className="d-block">{notif.createdAt}</small>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => {
                      console.log( notif.notification_utilisateur_id);
                      deleteData(
                        "Notification",
                        notif.notification_utilisateur_id,
                        ()=>{
                          socket.emit("getNotification", {
                            getNotification: "getNotification",
                          });
                        }
                      );
                    }}
                  >
                    <i className="fa fa-trash" style={{ color: "gray" }} />
                  </button>
                </td>
              </tr>
            ))}
            {list.length < 0 ? (
              <tr className="text-center">
                Voir tout dans le gestionnaire de notification
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GestionNotification;
