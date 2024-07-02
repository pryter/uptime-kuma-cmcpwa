<template>
    <div class="mb-3">
        <label for="tucmcapp-enrollmentId" class="form-label">Enrollment ID<span style="color: red;"><sup>*</sup></span></label>
        <input id="tucmcapp-enrollmentId" v-model="$parent.notification.enrollmentId" type="text" class="form-control" required>

        <div class="form-text">
            <span style="color: red;"><sup>*</sup></span>{{ $t("Required") }}
        </div>
    </div>
</template>
