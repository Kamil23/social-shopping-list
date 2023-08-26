deploy-prod:
	npm run build
	mkdir -p dist
	cp -r .next dist/
	cp -r components dist/
	cp -r enum dist/
	cp -r helpers dist/
	cp -r lib dist/
	cp -r pages dist/
	cp -r prisma dist/
	cp -r public dist/
	cp -r requests dist/
	cp -r styles dist/
	cp -r types dist/
	cp -r utils dist/
	cp .eslintrc.json dist/
	cp next-env.d.ts dist/
	cp next.config.js dist/
	cp package-lock.json dist/
	cp package.json dist/
	cp postcss.config.js dist/
	cp tailwind.config.js dist/
	cp tsconfig.json dist/
	scp -r dist/* miservice@s56.mydevil.net:domains/freshlist.pl/public_nodejs
	ssh miservice@s56.mydevil.net