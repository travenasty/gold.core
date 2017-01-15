// TODO : Upgrade store model through migration orb.000.js model schema files.

export const OrbVersion = 1;

export const OrbStores = {
  zone: '$$uuid,name',
  user: '$$uuid,name',
  page: '$$uuid,name',
  form: '$$uuid,name',
  rule: '$$uuid,name',
  memo: '$$uuid,name',
}

export const OrbModel = {
  'zone': [
    { name: 'sand'
    , info: 'Playground zone: Finders keepers losers weepers.'
    }
  ],
  'user': [
    { name: 'anon'
    , info: 'Unauthenticated guest user, basic read access.'
    }
  ],
  'page': [
    { name: 'home'
    , info: 'Landing page, site map index.'
    }
  ],
  'form': [
    { name: 'auth'
    , info: 'Log in credentials or register as a new user.'
    }
  ],
  'rule': [
    { name: 'none'
    , info: 'Do what you will shall be the whole of this law.'
    }
  ],
  'memo': [
    { name: 'note'
    , info: 'Hello! Is there anybody in there?'
    }
  ]
}
