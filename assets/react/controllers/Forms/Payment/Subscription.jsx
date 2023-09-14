import React from "react";
import Payment from "./Payment";

const features = ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3", "Bénéfice 4"];

const Subscription = ({ user, role }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-2xl font-bold mb-1">Palier "Starter"</h1>
          <h3 className="text-xl mb-2">
            Devenez um membre payant pour seulement 6 euros par mois et accédez
            à l'ensemble des fonctionnalités !
          </h3>

          <ul className="py-1 px-3">
            {features.map((f) => {
              return (
                <li key={f} className=" font-medium">
                  {`> ${f}`}
                </li>
              );
            })}
          </ul>
        </div>

        <h3 className="text-xl">
          Si vous préférez conserver l'option gratuite pour l'instant,{" "}
          <b>
            <u>
              <a href={`/${role}/home`}>clickez ici</a>
            </u>
          </b>
          .
        </h3>
      </div>
      <Payment />
    </div>
  );
};

export default Subscription;
