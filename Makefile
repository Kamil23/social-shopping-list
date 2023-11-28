deploy-prod-freshlist:
	rm -rf .next/
	npm run build
	mkdir -p dist
	cp -r .next dist/
	cp -r components dist/
	cp -r enum dist/
	cp -r helpers dist/
	cp -r hooks dist/
	cp -r lib dist/
	cp -r pages dist/
	cp -r prisma dist/
	cp -r public dist/
	cp -r requests dist/
	cp -r styles dist/
	cp -r types dist/
	cp .eslintrc.json dist/
	cp next-env.d.ts dist/
	cp next.config.js dist/
	cp package-lock.json dist/
	cp package.json dist/
	cp postcss.config.js dist/
	cp tailwind.config.js dist/
	cp tsconfig.json dist/
	scp -r dist/* miservice@s56.mydevil.net:domains/freshlist.pl/public_nodejs
	scp -r dist/.next/* miservice@s56.mydevil.net:domains/freshlist.pl/public_nodejs/.next
	ssh miservice@s56.mydevil.net

deploy-prod-livelist:
	rm -rf .next/
	rm -rf dist/
	npm run build
	mkdir -p dist
	cp -r .next dist/
	cp -r components dist/
	cp -r enum dist/
	cp -r helpers dist/
	cp -r hooks dist/
	cp -r lib dist/
	cp -r pages dist/
	cp -r prisma dist/
	cp -r public dist/
	cp -r requests dist/
	cp -r styles dist/
	cp -r types dist/
	cp .eslintrc.json dist/
	cp next-env.d.ts dist/
	cp next.config.js dist/
	cp package-lock.json dist/
	cp package.json dist/
	cp postcss.config.js dist/
	cp tailwind.config.js dist/
	cp tsconfig.json dist/
	scp -r dist/* miservice@s56.mydevil.net:domains/livelist.pl/public_nodejs
	scp -r dist/.next/* miservice@s56.mydevil.net:domains/livelist.pl/public_nodejs/.next
	ssh miservice@s56.mydevil.net