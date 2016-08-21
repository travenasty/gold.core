GOLD-UI
Goal Oriented Live Dialog

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
    hz version    # 1.1.3 as of this writing

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
