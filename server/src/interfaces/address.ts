export interface IAddAddressPayload {
  address: string
  label: string
}

export interface IUpdateAddressPayload extends IGetAddressPayload {
  address: IAddAddressPayload
}

export interface IGetAddressPayload {
  id: string
}

export interface IDeleteAddressPayload extends IGetAddressPayload {}
