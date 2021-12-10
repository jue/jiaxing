name = jx-tram
version = v1

image = $(name):$(version)
archive = $(name)-$(version).zip

name-prod = $(name)-prod
image-prod = $(name-prod):$(version)
archive-prod = $(name-prod)-$(version).zip

k8s_depoyment = jx-tram-server
k8s_dev_ns = dev-citybit
k8s_prod_ns = prod-bimgram

admin = root@test.hantram.citybit.cn
target_dir = ~

build-dev:
	docker build --force-rm --squash -t $(image) .

pack-dev: build-dev
	docker save $(image) | gzip -c > ./$(archive)

deploy-dev: pack-dev
	scp $(archive) $(admin):$(target_dir)/
	ssh $(admin) " docker load < $(target_dir)/$(archive) && \
		kubectl -n $(k8s_dev_ns) get po | grep $(k8s_depoyment) | awk '{print \$$1}' | xargs kubectl -n $(k8s_dev_ns) delete po "