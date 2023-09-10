import React from "react";
import Payment from "./Payment";

const Subscription = ({ user, role }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-2xl">Palier Starter </h1>
          <h3 className="text-xl">
            Devenez un membre payant pour seulement 6 Euros par mois et accédez
            à l'ensemble des fonctionalités!
          </h3>

          <ul className="py-1 px-2">
            <li>- Bénéfice 1</li>
            <li>- Bénéfice 2</li>
            <li>- Bénéfice 3</li>
            <li>- Bénéfice 4</li>
          </ul>
        </div>

        <h3 className="text-xl">
          Si vous preferez conserver l'option gratuite pour l'instant,{" "}
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
