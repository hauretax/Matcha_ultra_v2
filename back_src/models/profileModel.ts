enum gender {
  female,
  male,
  bigender,
  androgyne,
  neutrois,
  agender,
  intergender,
  demiboy,
  demigirl,
  hoter
}

export interface CreateProfileModel {
  email:string;
  username:string;
  lastName:string;
  firstName:string;
  password:string;
}

export interface ProfilModel extends CreateProfileModel {
  gender: gender;
  birthDate: string;
  orientation: Array<gender>;
  emailVerified: boolean;
}