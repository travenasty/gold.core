GOLD-CORE
Goal Oriented Living Documents - Rapid Development Environment

Assumptions:
  The following instructions are based on the author using an OS X El Capitan
  operating system and developed in August 2016, your results may vary.

Intentions:
  The purpose of this repository is to serve as a documented journey through a
  set-up process leveraging several of today's modern JavaScript build-tools.

  This project strives to provide a solid foundation built on top of popular  
  and proven libraries, resulting in an opinionated and concise framework.

  Step by step goals drive this vision forward, and is a living document
  being continually updated as best practices evolve and change over time.

Recommendations:
  @see : http://rob.conery.io/2016/07/04/imposters-handbook/
  For a wonderful guide that covers several techniques and topics that
  will make your experience of developing web applications smoother, from
  novice to advanced solutions.

Prerequisites:

  Install Git
    brew install git    # Version control system
    git --version   # 2.6.1 as of this writing

  Install Node.js:
    brew install node   # Server-side JavaScript platform
    node --version    # v6.2.2 as of this writing

  Install Rethink.db:
    brew install rethinkdb    # Distributed document database
    rethinkdb --version   # 2.3.2 as of this writing

  Install Horizion.io:
    npm install -g horizon    # Real-time client-server platform
    hz version    # 2.0.0 as of this writing

  Initialize project:
    hz init gold    # Checks for existing, or creates new directory
    cd gold   # Change the current path into the project directory
    npm init    # Initialize a new local Node package (creates: package.json)
    git init    # Initialize a new local git repository to track file changes
    git add package.json    # Track changes to the package configuration file
    git add dist    # Track changes to the generated output distribution files
    git commit -m "Initializing GOLD"   # First tracked change-set of files

  Start development server:
    hz serve --dev    # Running at http://localhost:8181

  Stop development server:
    ^C    # Ctrl+C, to kill/interrupt the process (SIGINT)

  Learn about semantic commits:
    @see : https://seesparkbox.com/foundry/semantic_commit_messages

  Install build tools:
    npm i --save-dev webpack    # Configurable JavaScript module bundler
    webpack --version   # 1.13.2 as of this writing
    npm i --save-dev webpack-dev-server   # Local development web-server
    npm i --save-dev url-loader file-loader json-loader    # Enable JSON parsing
    npm i --save-dev postcss-loader css-loader style-loader    # Stylesheet handlers

  Setup Horizon proxy:
    @see : https://discuss.horizon.io/t/horizon-with-webpack-dev-server/372
    touch dev-server.js    # Create file using your editor of choice.
    npm run dev:hz
    npm run dev:serve

  Setup CycleJS with xstream runner:
    npm i --save xstream @cycle/dom @cycle/isolate @cycle/xstream-run

  Setup Ramda:
    npm i --save ramda

  Setup HMR hot-module-replacement:
    @see : http://andrewhfarmer.com/webpack-hmr-tutorial
    @see : https://www.npmjs.com/package/cycle-hmr
    npm i --save-dev babel-plugin-espower babel-preset-stage-0 cycle-hmr
    touch .babelrc
