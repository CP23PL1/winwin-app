export type Address = {
  id: number;
  nameTH: string;
  nameEN: string;
};

export type SubDistrict = Address & {
  district: District;
};

export type District = Address & {
  province: Province;
};

export type Province = Address;
