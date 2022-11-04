// General imports
import User from "../models/User";

// Get assets function
export const getKYC = async (req, res) => {
  const {
    username,
    email,
    firstname,
    lastname,
    birthday,
    mobileprefix,
    mobile,
    country,
    city,
    postalcode,
    address,
    nationality,
  } = req.body;
  const { obverseDNI, reverseDNI, selfie } = req.files;

  await User.updateOne(
    { username: username },
    {
      firstname: firstname,
      lastname: lastname,
      birthday: birthday,
      mobileprefix: mobileprefix,
      mobile: mobile,
      country: country,
      city: city,
      postalcode: postalcode,
      address: address,
      nationality: nationality,
      obverseDNI: obverseDNI[0].path,
      reverseDNI: reverseDNI[0].path,
      selfie: selfie[0].path,
      KYCState: 1,
    }
  );

  const data = {
    username: username,
    email: email,
    KYCState: 1,
  };

  return res.status(200).json(data);
};
