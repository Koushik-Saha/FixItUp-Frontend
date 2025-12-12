# If the branch is NOT "main", skip the build
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "Branch '$VERCEL_GIT_COMMIT_REF' is not main – skipping build."
  exit 0   # 0 = no new build needed
fi

# For main, force a build
echo "Branch is main – building & deploying."
exit 1     # 1 = build needed
