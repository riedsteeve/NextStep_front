<template>
  <main class="w-full bg-gray-200 px-5 py-10 text-slate-800">
    <section class="mx-auto w-full rounded-xl bg-white p-6 shadow-xl md:p-8">
      <p class="text-sm font-bold uppercase tracking-wide text-purple-600">NextStep</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900">Politique de confidentialité</h1>

      <div class="mt-6 flex flex-col gap-5 text-sm leading-7 text-slate-600">
        <p>
          NextStep respecte la confidentialité de ses utilisateurs et s'engage à traiter les données personnelles de manière simple, transparente et conforme au RGPD.
        </p>

        <div>
          <h2 class="mb-2 text-lg font-bold text-slate-900">Données collectées</h2>
          <p>
            Lors de la création d'un compte, nous collectons uniquement les informations nécessaires au fonctionnement du service : nom, prénom, adresse email et mot de passe.
          </p>
        </div>

        <div>
          <h2 class="mb-2 text-lg font-bold text-slate-900">Utilisation de l'adresse email</h2>
          <p>
            L'adresse email est utilisée uniquement pour permettre à l'utilisateur de créer son compte, de se connecter et d'accéder à son espace personnel. Elle ne sera pas utilisée pour envoyer des newsletters, publicités ou communications commerciales.
          </p>
        </div>

        <div>
          <h2 class="mb-2 text-lg font-bold text-slate-900">Protection des données</h2>
          <p>
            Les données sont utilisées uniquement dans le cadre du service NextStep. Elles ne sont pas vendues, louées ou transmises à des tiers à des fins commerciales.
          </p>
        </div>

        <div>
          <h2 class="mb-2 text-lg font-bold text-slate-900">Droits des utilisateurs</h2>
          <p>
            Conformément au RGPD, chaque utilisateur peut demander l'accès, la modification ou la suppression de ses données personnelles.
          </p>
        </div>

        <RouterLink
          to="/sign"
          class="mt-2 inline-flex w-fit items-center rounded-md bg-purple-600 px-4 py-2 font-bold text-white transition hover:bg-purple-700"
        >
          Retour à la création du compte
        </RouterLink>
      </div>
    </section>
  </main>
</template>
