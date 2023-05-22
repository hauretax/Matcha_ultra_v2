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
  userName:string;
  lastName:string;
  firstName:string;
  password:string;
}

export interface ProfilModel extends CreateProfileModel {
  gender: gender;
  age: number;
  sexualPreferences: Array<gender>;
  verified: boolean;
}