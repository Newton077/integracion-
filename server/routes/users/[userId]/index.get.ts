import { IUserData } from "@wavynode/utils";
import { eventHandler, getRouterParam } from "h3";

// give wavynode access to your user's data
export default eventHandler(async (e) => {
  const userId = getRouterParam(e, "userId");

  const user: IUserData = await getUser(userId);

  return user;
});

/**
 * Mock function for demonstration purposes
 */
const getUser = async (_userId: string): Promise<IUserData> => {
  return new Promise((resolve, _reject) => {
    const mockUserData: IUserData = {
      givenName: "Maria Guadalupe",
      maternalSurname: "Sánchez",
      paternalSurname: "Rodríguez",
      birthdate: "1992-05-15",
      nationality: "MX",
      phoneNumber: {
        countryCode: "+52",
        phoneNumber: 5512345678,
      },
      email: "maria.guadalupe@example.com",
      address: {
        country: "MX",
        region: "CDMX",
        city: "Ciudad de México",
        street: "Avenida Insurgentes Sur",
        colonia: "Condesa",
        exteriorNumber: "123",
        interiorNumber: "4B",
        postalCode: "06100",
      },
      mexico: {
        rfc: "ROSM920515XXX",
        curp: "ROSM920515MDFRXXXX",
        actividadEconomica: 612012, // Example code for professional services
        cuentaRelacionada: "1234567890",
        clabeInterbancaria: undefined,
        monedaCuentaRelacionada: 1, // 1 -> MXN
        documentoIdentificacion: {
          tipoIdentificacion: 1, // Typically 1 for INE/IFE
          numeroIdentificacion: "IDMEX12345678",
        },
      },
    };
    // mock call to db
    resolve(mockUserData);
  });
};
