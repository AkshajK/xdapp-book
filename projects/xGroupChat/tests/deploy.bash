# Install Deps
yarn
#cd chains/evm && forge install --no-git --no-commit && cd ../../

# Deploy evm0 and evm1
ts-node orchestrator.ts deploy evm0
ts-node orchestrator.ts deploy evm1

# Register evm0 on evm1 and vice versa
ts-node orchestrator.ts register-network evm0 evm1
ts-node orchestrator.ts register-network evm1 evm0

