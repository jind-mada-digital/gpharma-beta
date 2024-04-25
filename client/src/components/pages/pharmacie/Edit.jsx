import React from "react";
import {
  getData,
  getUrl,
  InputForm,
  JsonToFormData,
  onChange,
  updateData,
  verifObligatory,
} from "../../../utils/utils";

const initialize = {
  nom_entreprise: "",
  logo: "",
  adresse: "",
  email: "",
  contact: "",
  website: "",
  nif: "",
  stat: "",
};
function Edit() {
  const [pharmacie, setPharmacie] = React.useState(initialize);
  const [isOb, setIsOb] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const { nom_entreprise, logo, adresse, email, contact, website, nif, stat } =
    pharmacie;

  const getMyData = () => {
    getData(
      "entreprise",
      (data) => {
        if(data){ 
          setPharmacie(data);
          setPreview(data.logo ? getUrl("images/entreprise", data.logo) : "");
        }
      },
      "GPHARMA_0001"
    );
  };
  const handleChange = (e) => onChange(e, setPharmacie);
  const getOb = () => (isOb ? "active" : "");

  const update = () => {
    setIsOb(true);
    if (verifObligatory(pharmacie, ["logo", "deletedAt"])) return;
    updateData(
      "entreprise",
      "GPHARMA_0001",
      JsonToFormData(pharmacie, logo, "logo"),
      getMyData,
      true
    );
  };

  React.useEffect(() => {
    getMyData();
  }, []);

  return (
    <>
      <div className="form-group p-2">
        <InputForm
          name="nom_entreprise"
          val={nom_entreprise}
          onChange={handleChange}
          obligatory={getOb}
        >
          Nom du pharmacie
        </InputForm>
        <div className="row">
          <div className="col-6">
            <InputForm
              name="adresse"
              val={adresse}
              onChange={handleChange}
              obligatory={getOb}
            >
              Adresse
            </InputForm>
          </div>
          <div className="col">
            <InputForm
              name="contact"
              val={contact}
              onChange={handleChange}
              obligatory={getOb}
            >
              Contact
            </InputForm>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <InputForm
              name="email"
              val={email}
              onChange={handleChange}
              obligatory={getOb}
            >
              Email
            </InputForm>
          </div>
          <div className="col">
            <InputForm
              name="website"
              val={website}
              onChange={handleChange}
              obligatory={getOb}
            >
              Site web
            </InputForm>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <InputForm
              name="nif"
              val={nif}
              onChange={handleChange}
              obligatory={getOb}
            >
              Nif
            </InputForm>
          </div>
          <div className="col">
            <InputForm
              name="stat"
              val={stat}
              onChange={handleChange}
              obligatory={getOb}
            >
              Stat
            </InputForm>
          </div>
        </div>
        <div className="row align-items-center mt-3 mb-0">
          <div className="col text-center">
            <input
              type="file"
              id="logo"
              className="d-none"
              name="logo"
              onChange={(e) => {
                if (e.target.files[0])
                  setPreview(URL.createObjectURL(e.target.files[0]));
                setPharmacie({ ...pharmacie, ["logo"]: e.target.files[0] });
              }}
            />
            <img
              src={preview ? preview : "images/users/1.jpg"}
              className="img-fluid"
              style={{ height: "20vh", cursor: "pointer" }}
              alt="Logo du pharmacie"
              onClick={() => {
                document.getElementById("logo").click();
              }}
            />
          </div>
          <div className="col">
            <button className="btn btn-outline-primary w-100" onClick={update}>
              <i className="fa fa-save mr-2"></i>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
