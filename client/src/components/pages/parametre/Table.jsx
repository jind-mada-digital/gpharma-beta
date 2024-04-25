import React from "react";
import { toast } from "react-toastify";
import MyDataTable from "../../../utils/mydatatable/MyDataTable";
import {
  addData,
  ButtonTable,
  confirmDelete,
  deleteData,
  filterOption,
  getData,
  InputForm,
  SelectForm,
  updateData,
  deleteSave,
  createSave,
  createSave2,
  downSave,
} from "../../../utils/utils";
import {
  faCheck,
  faEdit,
  faFileImport,
  faRecycle,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { countArr, table_name } from "../../../atoms/parametre";
import DataTable from "react-data-table-component";

function Table() {
  const [tb_name, setTb_name] = useRecoilState(table_name);
  const [countArray, setCountArray] = useRecoilState(countArr);
  const [new_name, setNew_name] = useState("");
  const [file, setFile] = useState("");
  const [sourceSave, setSourceSave] = useState("");
  const [sourceImport, setSourceImport] = useState("");
  const [edit_item, setEdit_item] = useState({});
  const [listBefore, setListBefore] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [list, setList] = useState([]);
  let style = [];

  // fonction byteConverteur
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  // fonction pour update de sauvegarde
  const saveUpdate = () =>{
    getData('modules/gp-backup/lists', setBackupData)
  }

  useEffect(() => {
    setEdit_item({});
    if (tb_name != "importExport" && tb_name != "save") {
      // getData("parametre/count", setCountArray);
      getData(tb_name, setListBefore);
    }
    if (tb_name == "save") {
      getData('modules/gp-backup/lists', setBackupData)
    }
  }, [tb_name]);

  useEffect(() => {
    let i = 0;
    let tempFull = [];
    Object.entries(listBefore).forEach(([key, value]) => {
      let temp = [];
      Object.entries(value).forEach(([k, val]) => {
        if (k == "id") {
          temp["id"] = val;
          temp["rang"] = ++i;
        } else if (k.indexOf("nom") > -1) {
          temp["nom"] = val;
        }
      });
      tempFull.push(temp);
    });
    setList(tempFull);
    //consol.log("list ;", list);
  }, [listBefore]);

  const update = (row) => {
    //consol.log("update", row);
    updateData(
      tb_name,
      row.id,
      JSON.parse(`{"nom_${tb_name}": "${edit_item.nom}"}`),
      () => {
        setEdit_item({});
        getData(tb_name, setListBefore);
        getData("parametre/count", setCountArray);
      }
    );
  };

  const caseInsensitiveSort = (rowA, rowB) => {
    const a = rowA.fileCreationDate;
    const b = rowB.fileCreationDate;

    if (a > b) {
        return -1;
    }

    if (b > a) {
        return 1;
    }

    return 0;
  };

  const columns = [
    {
      name: "#",
      selector: (row) => list.indexOf(row) + 1,
      sortable: true,
      width: "10%",
    },
    {
      name: "Nom",
      selector: (row) => {
        return (
          <span
            key={row.id}
            onDoubleClick={() => {
              setEdit_item(row);
            }}
          >
            {row.id === edit_item.id ? (
              <input
                key={row.id}
                className="form-control"
                value={edit_item.nom}
                onChange={(e) => {
                  setEdit_item({ id: edit_item.id, nom: e.target.value });
                }}
                onKeyPress={(e) => {
                  if (e.key == "Enter" && edit_item) update(row);
                }}
                // onBlur={update(row)}
              />
            ) : (
              row.nom
            )}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      width: "25%",
      selector: (row) => {
        let iconEdit = faEdit;
        let importance = "warning ml-2";
        if (row.id === edit_item.id) {
          importance = "success ml-2";
          iconEdit = faCheck;
        }
        return (
          <div className="btn-group">
            <ButtonTable
              importance={importance}
              icon={iconEdit}
              data-toggle="modal"
              data-target="#modalUtilisateur"
              handleClick={() => {
                if (iconEdit == faEdit) setEdit_item(row);
                if (iconEdit == faCheck) update(row);
              }}
            />
            <ButtonTable
              importance="danger ml-2"
              icon={faTrash}
              handleClick={() => {
                //consol.log(tb_name);
                confirmDelete(
                  "Voulez-vous vraimment supprimé cet " + tb_name + "?",
                  () => {
                    deleteData(tb_name, row.id, () => {
                      getData("parametre/count", setCountArray);
                      getData(tb_name, setListBefore);
                    });
                  }
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  const backupColumn = [
    {
      name: "#",
      selector: (row) => backupData.indexOf(row) + 1,
      sortable: true,
      width: "10%",
    },
    {
      name: "Nom",
      selector: (row) => row.fileName,
      sortable: true,
    },
    {
      name: "Date du sauvegarde",
      selector: (row) => { let date = new Date(row.fileCreationDate)
        return date.toLocaleString()
      } ,
      sortable: true,
      sortFunction: caseInsensitiveSort,
    },
    {
      name: "Taille du fichier",
      selector: (row) => formatBytes(row.fileSizeInKB),
      sortable: true,
    },
    {
      name: "Action",
      width: "25%",
      selector: (row) => {
        return (
          <div className="btn-group">
            <ButtonTable importance="primary ml-2" icon={faRecycle} handleClick={(e)=>console.log(e)} />

            <ButtonTable importance="info ml-2" icon={faSave} handleClick={()=>{
              const fileDown = downSave(row.fileName);  
              window.location.href = fileDown
            }}/>
            
            <ButtonTable importance="danger ml-2" icon={faTrash} 
            handleClick={() => {
                confirmDelete(
                  <>
                    Voulez-vous vraimment supprimé le sauvegarde{" "}
                    <b>{row.fileName} du {new Date(row.fileCreationDate).toLocaleDateString()}</b> ?<br />
                    Par cette action est ireversible
                  </>,
                  () => {deleteSave(row.fileName);saveUpdate()}
                );
              }} />
          </div>
        );
      },
    },
  ];

  const importOption = [{"label":"Fichier"},{"label":"URL"},{"label":"Drive"}]

  const formatName = (name) => {
    if (name == "mode_expedition") return "mode d'expedition";
    return name;
  };

  const add = () => {
    if (new_name != "") {
      addData(tb_name, JSON.parse(`{"nom_${tb_name}": "${new_name}"}`), () => {
        setNew_name("");
        getData("parametre/count", setCountArray);
        getData(tb_name, setListBefore);
      });
    }
  };

  return (
    <>
      {tb_name != "importExport" && tb_name != "save" && (
        <div className="row">
          <div className="col-12">
            <div className="right-box-padding">
              <div className="read-content">
                <div className="media pt-3 d-sm-flex d-block justify-content-between">
                  <div className="clearfix  w-100 mb-3 mr-2 d-flex">
                    <input
                      type="text"
                      className="form-control"
                      value={new_name}
                      onChange={(e) => setNew_name(e.target.value)}
                      placeholder={"Ajout d'un nouveau " + formatName(tb_name)}
                      onKeyPress={(e) => {
                        if (e.key == "Enter") add();
                      }}
                    />
                  </div>
                  <div className="clearfix mb-3 btn-group">
                    <button
                      type="button"
                      className="btn btn-primary px-3 light"
                      onClick={add}
                    >
                      <i className="fa fa-check" />{" "}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary px-3 light ml-2"
                      onClick={() => setNew_name("")}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </div>

                <hr />
                <MyDataTable
                  data={list}
                  columns={columns}
                  filterClass="form-control form-control-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {tb_name == "importExport" && (
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="right-box-padding">
              <div className="read-content">
                <div className="media pt-3 d-sm-flex d-block justify-content-between">
                <h3> <i className="fa fa-download"></i> IMPORTER UN FICHIER </h3>                 
                </div>
                <hr />                
                <div className="col-xl-12 col-sm-12 pb-4">
                  <SelectForm
                    val={importOption.label}
                    value={filterOption(importOption, importOption.label)}
                    options={importOption}
                    onChange= {(e =>{console.log(e.label);
                      setSourceImport(e.label)
                      }) }        
                  >
                    Importer depuis :
                  </SelectForm>                  
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="right-box-padding">
              <div className="read-content">
                {sourceImport == 'Fichier' &&
                  <div className="col-xl-12 col-sm-12 pt-5">
                    <br /> <br />
                    <b>Importé un fichier</b>
                    <div className="input-group transparent-append mt-1">
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        className="custom-file-input"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          // setFile(e.target.files[0]);
                          // console.log("file", file);
                        }}
                      />
                      <label className="custom-file-label">
                        {file
                          ? file.name.length > 20
                            ? file.name.slice(0, 25) + "..."
                            : file.name
                          : "Choisissez un ficher"}
                      </label>
                    </div>
                  </div>
                }

              </div>
            </div>
          </div>
        </div>
      )}
      {tb_name == "save" && (
        <div className="row">
          <div className="col-12">
            <div className="right-box-padding">
              <div className="read-content">
                <div className="media pt-3 d-sm-flex d-block justify-content-between">
                  <h3> <i className="fa fa-save"></i> Sauvegarde</h3>
                </div>
                <ButtonTable
                    type="button"
                    className="btn btn-primary ml-auto mt-2"
                    onClick={ async () => {
                      await createSave();            
                      saveUpdate();
                    }}
                  >
                    Créer une sauvegarde
                </ButtonTable>
                
                <hr />
                <h3>Restauration</h3>
                <DataTable
                  data={backupData}
                  columns={backupColumn}
                  defaultSortFieldId={3}
                  filterClass="form-control form-control-sm"
                />
                <hr />
                <br />
                <h3> <i className="fa fa-recycle"></i> Restauration personnalisée</h3>
                <div className="row">
                  <div className="col-3 custom-control custom-checkbox d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="Tous"
                      onChange={() => {
                        console.log('Tous')
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="Tous"
                    >Tous</label>
                  </div>
                  <div className="col-3 custom-control custom-checkbox d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="Produits"
                      onChange={() => {
                        console.log('Produits')
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="Produits"
                    >Produits</label>
                  </div>
                  <div className="col-3 custom-control custom-checkbox d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="Personnels"
                      onChange={() => {
                        console.log('Personnels')
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="Personnels"
                    >Personnels</label>
                  </div>
                  <div className="col-3 custom-control custom-checkbox d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="Parametre"
                      onChange={() => {
                        console.log('Parametre')
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="Parametre"
                    >Parametre</label>
                  </div>

                </div>
                <div className="row pt-5">
                  <div className="col-xl-6 col-sm-12 pb-4">
                    <SelectForm
                      val={importOption.label}
                      value={filterOption(importOption, importOption.label)}
                      options={importOption}
                      onChange= {(e =>{console.log(e.label);
                        setSourceSave(e.label)
                        }) }        
                    >
                      Importer depuis :
                    </SelectForm>
                  </div>
                  {sourceSave == 'Fichier' &&
                  <div className="col-xl-6 col-sm-12">
                    <b>Importer un fichier</b>
                    <div className="input-group transparent-append mt-1">
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        className="custom-file-input"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          // setFile(e.target.files[0]);
                          // console.log("file", file);
                        }}
                      />
                      <label className="custom-file-label">
                        {file
                          ? file.name.length > 20
                            ? file.name.slice(0, 25) + "..."
                            : file.name
                          : "Choisissez un ficher"}
                      </label>
                    </div>
                  </div>
                   }
                   <ButtonTable
                    type="button"
                    icon={faRecycle}
                    className="btn btn-primary ml-auto mt-5"
                    onClick={() => { }}
                  >
                    Restaurer
                  </ButtonTable> 

                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
