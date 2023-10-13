import React from "react";
import axios from "axios";
import { initWeb3 } from "../services/web3.service";

import { fileUploadUrl, jsonUploadUrl, metadataJson,REACT_APP_PINATA_JWT_TOKEN } from "../utils/constants/constants";

import { NftContext } from "../context/nft/nft.context";
import { MetamaskContext } from "../context/metamask/metamask.context";

function CreatNft() {

    const {
        allowance,
        handleCreateNft,
        fetchAllowance,
        handleApproveTokens,
    } = React.useContext(NftContext);

    const { connectedAccount } = React.useContext(MetamaskContext);

    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [det, setDetial] = React.useState(null);


    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(URL.createObjectURL(img))
        }
    };

    const onNameChange = async(event) => {
        setName(event.target.value);
    }

    const onDetChange = (event) => {
        setDetial(event.target.value)
    }



    const createNFT = async () => {
        setLoading(true);

        let formData = new FormData();

        const r = await fetch(image);
        const blob = await r.blob();
        formData.append("file", blob);
        const metadata = JSON.stringify({
            name: name,
            keyvalues: {
                exampleKey: 'testnet'
            }
        });

        formData.append('pinataMetadata', metadata);

        const url = fileUploadUrl;

        axios.post(url, formData, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${REACT_APP_PINATA_JWT_TOKEN}`,
            }
        }).then(function (fileUploadResp) {
            const metaJson = { ...metadataJson };
            metaJson.name = name;
            metaJson.description = det ? det : metaJson.description;
            metaJson.image = `ipfs://${fileUploadResp.data.IpfsHash}`;

            const url = jsonUploadUrl;

            return axios.post(url, { pinataMetadata: { name: `${name}.json` }, pinataContent: metaJson }, {
                headers: {
                    Authorization: `Bearer ${REACT_APP_PINATA_JWT_TOKEN}`,
                }
            }).then(function (jsonUploadResp) {
                const res = handleCreateNft({
                    tokenUri: jsonUploadResp.data.IpfsHash,
                    accountAddress: connectedAccount
                });

                if (res) {
                    console.log('create nft result', res);
                    setName("")
                    setImage()
                    setDetial("")
                    setLoading(false);
                }
            })
                .catch(function (jsonUploadError) {
                    console.log('jsonUploadError', jsonUploadError)
                    setLoading(false)
                });
        })
            .catch(function (fileUploadError) {
                console.log('fileUploadError', fileUploadError)
                setLoading(false)

            });
    }




    // React.useEffect(() => {
    //     if (connectedAccount) {
    //         (async () => {
    //             await fetchAllowance(connectedAccount);
    //         })();
    //     }
    // }, [connectedAccount]);



    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div style={{ margin: '5rem auto' }}>

            <div>
                {
                    image ? <img src={image} /> : <input type='file'
                        name='image-upload'
                        onChange={onImageChange}
                    />
                }
                <br />

                <input type="text" name="Name" onChange={onNameChange} value={name} placeholder="Name" /><br />

                <input type="text" name="Detail" onChange={onDetChange} value={det} placeholder="Detail" /><br />

                <button onClick={createNFT}>Create NFT</button>

            </div>

        </div>
    );
}

export default CreatNft;