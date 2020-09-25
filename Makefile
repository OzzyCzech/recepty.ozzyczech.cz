all:
	yarn install --production --no-color
	yarn run build

release:
	git commit --allow-empty -m "Publish at `date +%F-%T`"
	git push
	
PHONY: all release
